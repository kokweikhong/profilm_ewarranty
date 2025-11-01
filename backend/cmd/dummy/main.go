package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/kokweikhong/profilm_ewarranty/backend/internal/config"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/dummy"
)

func main() {
	var (
		dataType = flag.String("type", "", "Type of dummy data to create (products, shops, product-allocations, all)")
		count    = flag.Int("count", 50, "Number of records to create for each type")
		help     = flag.Bool("help", false, "Show help")
	)
	flag.Parse()

	if *help {
		printHelp()
		return
	}

	if *dataType == "" {
		fmt.Println("Error: data type is required")
		printHelp()
		os.Exit(1)
	}

	// Load configuration
	cfg := config.Load()

	// Initialize database
	database, err := db.NewDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()

	ctx := context.Background()

	// Initialize dummy data generator
	generator := dummy.NewGenerator(database.Pool)

	// Run appropriate dummy data generation
	switch *dataType {
	case "products":
		if err := generator.GenerateProducts(ctx, *count); err != nil {
			log.Fatal("Failed to generate products:", err)
		}
		fmt.Printf("✅ Generated %d products successfully\n", *count)
	case "shops":
		if err := generator.GenerateShops(ctx, *count); err != nil {
			log.Fatal("Failed to generate shops:", err)
		}
		fmt.Printf("✅ Generated %d shops successfully\n", *count)
	case "product-allocations":
		if err := generator.GenerateProductAllocations(ctx, *count); err != nil {
			log.Fatal("Failed to generate product allocations:", err)
		}
		fmt.Printf("✅ Generated %d product allocations successfully\n", *count)
	case "all":
		if err := generator.GenerateAll(ctx, *count); err != nil {
			log.Fatal("Failed to generate all dummy data:", err)
		}
		fmt.Printf("✅ Generated %d records of each type successfully\n", *count)
	default:
		fmt.Printf("Error: unknown data type '%s'\n", *dataType)
		printHelp()
		os.Exit(1)
	}
}

func printHelp() {
	fmt.Println("Dummy Data Generator - Generate test data for development")
	fmt.Println()
	fmt.Println("Usage:")
	fmt.Println("  dummy -type <data-type> [-count <number>]")
	fmt.Println()
	fmt.Println("Available data types:")
	fmt.Println("  products             Generate dummy products (requires existing product names, brands, etc.)")
	fmt.Println("  shops               Generate dummy shops (requires existing states)")
	fmt.Println("  product-allocations Generate dummy product allocations (requires existing products and shops)")
	fmt.Println("  all                 Generate all data types")
	fmt.Println()
	fmt.Println("Options:")
	fmt.Println("  -count <number>     Number of records to create for each type (default: 50)")
	fmt.Println("  -help               Show this help message")
	fmt.Println()
	fmt.Println("Prerequisites:")
	fmt.Println("  - Run seeds first to create foundation data (brands, types, series, names, states, warranty years)")
	fmt.Println("  - Use 'make seed-all' to set up all required foundation data")
	fmt.Println()
	fmt.Println("Dependency Order:")
	fmt.Println("  1. Foundation data  (Run 'make seed-all' first)")
	fmt.Println("  2. products        (Independent)")
	fmt.Println("  3. shops           (Independent)")
	fmt.Println("  4. product-allocations (Requires products and shops)")
	fmt.Println()
	fmt.Println("Examples:")
	fmt.Println("  dummy -type products")
	fmt.Println("  dummy -type shops -count 100")
	fmt.Println("  dummy -type all -count 25")
}