# Repository and Services Architecture Guide

This document explains the separation of concerns between the Repository and Services layers in our Go API.

## 🏗️ Architecture Overview

```
HTTP Handlers → Services → Repository → Database (SQLC)
```

## 📂 Repository Layer (`internal/repository/`)

### **Purpose**

The repository layer is responsible for **data access** and acts as an abstraction between your business logic and the database.

### **What Goes in Repository:**

#### ✅ **Data Access Operations**

- CRUD operations (Create, Read, Update, Delete)
- Complex database queries
- Database transaction management
- Data mapping between database and domain models

#### ✅ **Database-Specific Logic**

- SQL query execution
- Connection pooling management
- Database error handling
- Data validation at the database level

#### ✅ **Example Repository Methods**

```go
// User Repository
Create(ctx, CreateUserParams) (*User, error)
GetByID(ctx, uuid.UUID) (*User, error)
GetByEmail(ctx, string) (*User, error)
Update(ctx, uuid.UUID, UpdateUserParams) (*User, error)
Delete(ctx, uuid.UUID) error
List(ctx, limit, offset int32) ([]*User, error)
ExistsByEmail(ctx, string) (bool, error)

// Product Repository
Create(ctx, CreateProductParams) (*Product, error)
GetByModel(ctx, string) (*Product, error)
ListByBrand(ctx, string, limit, offset int32) ([]*Product, error)
```

#### ✅ **Repository Structure**

```go
type UserRepository interface {
    // Define methods
}

type userRepository struct {
    db *pgxpool.Pool  // Database connection
}

func NewUserRepository(db *pgxpool.Pool) UserRepository {
    return &userRepository{db: db}
}
```

---

## 🔧 Services Layer (`internal/services/`)

### **Purpose**

The services layer contains **business logic** and orchestrates operations across multiple repositories.

### **What Goes in Services:**

#### ✅ **Business Logic & Rules**

- Data validation and business rules
- Complex calculations
- Business workflow orchestration
- Cross-entity operations

#### ✅ **Authentication & Authorization**

- User authentication
- Password hashing/verification
- JWT token management
- Permission checks

#### ✅ **Data Transformation**

- Converting between different data formats
- Aggregating data from multiple sources
- Business-specific data formatting

#### ✅ **Coordination Between Repositories**

- Operations that involve multiple entities
- Transaction coordination
- Event handling

#### ✅ **Example Service Methods**

```go
// User Service (Business Logic)
CreateUser(ctx, CreateUserRequest) (*UserResponse, error)      // Validation + hashing + creation
AuthenticateUser(ctx, email, password) (*UserResponse, error) // Login logic
ChangePassword(ctx, userID, oldPass, newPass) error          // Password change business logic
GetUserProfile(ctx, userID) (*UserProfile, error)           // Aggregate user data

// Warranty Service (Complex Business Logic)
CreateWarranty(ctx, CreateWarrantyRequest) (*WarrantyResponse, error) // Calculate warranty dates
CheckWarrantyStatus(ctx, serialNumber) (*WarrantyStatus, error)       // Business status logic
GetExpiringWarranties(ctx, days int32) ([]*WarrantyResponse, error)   // Complex filtering
ProcessWarrantyClaim(ctx, claimRequest) (*ClaimResponse, error)       // Multi-step business process
```

#### ✅ **Service Structure**

```go
type UserService interface {
    // Business operations
}

type userService struct {
    userRepo    UserRepository     // Data access
    emailSvc    EmailService       // External services
    // Other dependencies
}

func NewUserService(userRepo UserRepository, emailSvc EmailService) UserService {
    return &userService{
        userRepo: userRepo,
        emailSvc: emailSvc,
    }
}
```

---

## 📋 **What Goes Where - Quick Reference**

| Layer          | Responsibilities                                                                                                             | Examples                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Repository** | - Database queries<br>- Data persistence<br>- Simple CRUD operations<br>- Database transactions                              | `GetUserByEmail()`<br>`CreateProduct()`<br>`UpdateWarrantry()`                                          |
| **Services**   | - Business validation<br>- Complex operations<br>- Authentication logic<br>- Cross-entity operations<br>- External API calls | `AuthenticateUser()`<br>`ProcessWarrantyClaim()`<br>`SendWelcomeEmail()`<br>`CalculateWarrantyExpiry()` |

---

## 🔄 **Example Flow: User Registration**

```go
// 1. Handler receives HTTP request
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    json.NewDecoder(r.Body).Decode(&req)

    // 2. Call Service (Business Logic)
    user, err := h.userService.CreateUser(r.Context(), req)
    // Handle response...
}

// 3. Service handles business logic
func (s *userService) CreateUser(ctx context.Context, req CreateUserRequest) (*UserResponse, error) {
    // Business validations
    if err := s.validateEmail(req.Email); err != nil {
        return nil, err
    }

    // Check if user exists (business rule)
    exists, err := s.userRepo.ExistsByEmail(ctx, req.Email)
    if exists {
        return nil, fmt.Errorf("user already exists")
    }

    // Hash password (business logic)
    hashedPassword, err := utils.HashPassword(req.Password)

    // 4. Repository handles data persistence
    user, err := s.userRepo.Create(ctx, CreateUserParams{
        Email:        req.Email,
        PasswordHash: hashedPassword,
    })

    // 5. Send welcome email (business logic)
    s.emailService.SendWelcome(user.Email)

    return s.mapUserToResponse(user), nil
}

// 6. Repository executes database operations
func (r *userRepository) Create(ctx context.Context, params CreateUserParams) (*User, error) {
    query := `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *`
    // Execute SQL query...
}
```

---

## 🎯 **Benefits of This Architecture**

### **Separation of Concerns**

- **Repository**: Handles data persistence
- **Services**: Handles business logic
- **Handlers**: Handles HTTP concerns

### **Testability**

- Easy to mock repositories for service testing
- Easy to mock services for handler testing
- Clear boundaries for unit tests

### **Maintainability**

- Business logic centralized in services
- Database logic isolated in repositories
- Easy to change database implementation

### **Reusability**

- Services can be used by multiple handlers
- Repositories can be used by multiple services
- Clear interfaces for dependency injection

---

## 📁 **File Organization**

```
internal/
├── repository/
│   ├── interfaces.go           # Repository interfaces
│   ├── user_repository.go      # User data access
│   ├── product_repository.go   # Product data access
│   └── warranty_repository.go  # Warranty data access
├── services/
│   ├── user_service.go         # User business logic
│   ├── product_service.go      # Product business logic
│   ├── warranty_service.go     # Warranty business logic
│   └── auth_service.go         # Authentication logic
└── handlers/
    ├── user_handler.go         # User HTTP handlers
    ├── product_handler.go      # Product HTTP handlers
    └── warranty_handler.go     # Warranty HTTP handlers
```

---

## 🚀 **Implementation Tips**

1. **Start with Repository interfaces** - Define what data operations you need
2. **Implement Repository with SQLC** - Use generated code for type safety
3. **Build Services on top** - Add business logic and validation
4. **Keep Handlers thin** - They should only handle HTTP concerns
5. **Use dependency injection** - Pass repositories to services, services to handlers
6. **Write tests for each layer** - Mock dependencies for isolated testing

This architecture provides a clean, maintainable, and testable codebase that scales well as your application grows!
