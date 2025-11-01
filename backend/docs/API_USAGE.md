# Claims API Usage Examples

## Create Claim

**POST** `/api/claims`

```json
{
  "warranty_id": "123e4567-e89b-12d3-a456-426614174000",
  "claim_no": "CLM-2024-001",
  "status": "pending",
  "claim_date": "2024-11-01",
  "damaged_image_url": "https://example.com/damaged.jpg",
  "resolution_image_url": "https://example.com/resolution.jpg",
  "remarks": "Customer reported scratches on the film"
}
```

**Response (201 Created):**

```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "warranty_id": "123e4567-e89b-12d3-a456-426614174000",
  "claim_no": "CLM-2024-001",
  "status": "pending",
  "claim_date": "2024-11-01",
  "damaged_image_url": "https://example.com/damaged.jpg",
  "resolution_image_url": "https://example.com/resolution.jpg",
  "remarks": "Customer reported scratches on the film",
  "created_at": "2024-11-01T10:30:00Z",
  "updated_at": "2024-11-01T10:30:00Z"
}
```

## Update Claim

**PUT** `/api/claims/{id}`

```json
{
  "status": "resolved",
  "resolution_image_url": "https://example.com/final-resolution.jpg",
  "remarks": "Issue resolved with replacement film"
}
```

## Get Claim

**GET** `/api/claims/{id}`

## List Claims

**GET** `/api/claims`

## Validation Rules

### Create Claim Request

- `warranty_id`: Required, must be valid UUID
- `claim_no`: Required, 1-100 characters
- `status`: Required, one of: pending, investigating, resolved, rejected
- `claim_date`: Required, format: "YYYY-MM-DD"
- `damaged_image_url`: Required, must be valid URL
- `resolution_image_url`: Optional, must be valid URL if provided
- `remarks`: Optional, max 1000 characters

### Update Claim Request

- `status`: Optional, one of: pending, investigating, resolved, rejected
- `claim_date`: Optional, format: "YYYY-MM-DD"
- `damaged_image_url`: Optional, must be valid URL if provided
- `resolution_image_url`: Optional, must be valid URL if provided
- `remarks`: Optional, max 1000 characters

## Benefits of Using DTOs

1. **Type Safety**: UUID fields are properly validated as strings in JSON and converted to UUID types
2. **Validation**: Request validation with clear error messages
3. **pgtype Handling**: Automatic conversion between pgtype.Date/pgtype.Text and standard types
4. **Clean APIs**: Consistent JSON structure without exposing internal database types
5. **Flexibility**: Easy to add/remove fields without changing database schema
