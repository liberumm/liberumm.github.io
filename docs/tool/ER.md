```Mermaid
erDiagram
    %% Category: Central table for classification
    Category {
        int CategoryID PK "Primary Key: Category ID"
        string CategoryName "Category Name"
        int ParentCategoryID FK "Foreign Key: Parent Category ID (Self-referencing)"
        datetime CreatedAt "Creation Date"
        datetime UpdatedAt "Update Date"
    }

    %% Structure: Core structure information
    Structure {
        int StructureID PK "Primary Key: Structure ID"
        int CategoryID FK "Foreign Key: Category ID"
        string StructureName "Structure Name"
        datetime CreatedAt "Creation Date"
        datetime UpdatedAt "Update Date"
    }

    %% Property: Defining properties
    Property {
        int PropertyID PK "Primary Key: Property ID"
        int StructureID FK "Foreign Key: Structure ID"
        string PropertyName "Property Name"
        text PropertyList_JSON "Property List (JSON format)"
        datetime CreatedAt "Creation Date"
        datetime UpdatedAt "Update Date"
    }

    %% PropertyReference: Constraints between properties and structures
    PropertyReference {
        int ReferenceID PK "Primary Key: Reference ID"
        int StructureID FK "Foreign Key: Structure ID"
        int PropertyID FK "Foreign Key: Property ID"
        string PropertyType "Data Type"
        string ConstraintType "Constraint Type"
        text ConstraintValue_JSON "Constraint Value (Recommended in JSON format)"
        string DefaultValue "Default Value (Nullable)"
        datetime CreatedAt "Creation Date"
        datetime UpdatedAt "Update Date"
    }

    %% Data: Storing actual data
    Data {
        int DataID PK "Primary Key: Data ID"
        int StructureID FK "Foreign Key: Structure ID"
        text DataValue_JSON "Data Value (JSON format)"
        datetime CreatedAt "Creation Date"
        datetime UpdatedAt "Update Date"
    }
    
    %% Relationships
    Data }|--|| Structure : "Data and Structure Relationship"
    Structure ||--|| Property : "Structure and Property Relationship"
    Structure ||--o{ PropertyReference : "Structure and Property Constraints Relationship"
    Category ||--|| Structure : "Category and Structure Relationship"
    Property ||--|| PropertyReference : "Property and Property Constraints Relationship"
````