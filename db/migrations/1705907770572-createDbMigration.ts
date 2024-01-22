import { UserRole } from "../../src/auth/dtos/role.enum";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateDbMigration1705907770572 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "user",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "120",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: [UserRole.OWNER, UserRole.OPERATOR, UserRole.VIEWER],
                        default: `'VIEWER'`,
                        enumName: "user_role",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "farm",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "120",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "location",
                        type: "jsonb",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );

        await queryRunner.createIndex(
            "farm",
            new TableIndex({
                name: "IDX_FARM_ID",
                columnNames: ["id"],
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "field",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "120",
                        isNullable: false,
                    },
                    {
                        name: "boundary",
                        type: "jsonb",
                        isNullable: false,
                    },
                    {
                        name: "farm_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "soil_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );

        await queryRunner.createIndex(
            "field",
            new TableIndex({
                name: "IDX_FIELD_ID",
                columnNames: ["id"],
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "soil",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "120",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );

        await queryRunner.createIndex(
            "soil",
            new TableIndex({
                name: "IDX_SOIL_ID",
                columnNames: ["id"],
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "crop",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "120",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );

        await queryRunner.createIndex(
            "crop",
            new TableIndex({
                name: "IDX_CROP_ID",
                columnNames: ["id"],
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "machine",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "brand",
                        type: "varchar",
                        length: "120",
                        isNullable: false,
                    },
                    {
                        name: "model",
                        type: "varchar",
                        length: "120",
                        isNullable: false,
                    },
                    {
                        name: "register_number",
                        type: "varchar",
                        length: "120",
                        isNullable: false,
                    },
                    {
                        name: "farm_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );

        await queryRunner.createIndex(
            "crop",
            new TableIndex({
                name: "IDX_MACHINE_ID",
                columnNames: ["id"],
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "growing_crop_period",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "field_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "crop_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );

        await queryRunner.createIndex(
            "growing_crop_period",
            new TableIndex({
                name: "IDX_GROWING_CROP_PERIOD_ID",
                columnNames: ["id"],
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "processing_type",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "120",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );

        await queryRunner.createIndex(
            "processing_type",
            new TableIndex({
                name: "IDX_PROCESSING_TYPE_ID",
                columnNames: ["id"],
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "processing",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "date",
                        type: "date",
                        isNullable: false,
                    },
                    {
                        name: "growing_crop_period_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "processing_type_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "machine_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "field",
            new TableForeignKey({
                columnNames: ["farm_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "farm",
            })
        );
        await queryRunner.createForeignKey(
            "field",
            new TableForeignKey({
                columnNames: ["soil_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "soil",
            })
        );
        await queryRunner.createForeignKey(
            "growing_crop_period",
            new TableForeignKey({
                columnNames: ["crop_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "crop",
            })
        );
        await queryRunner.createForeignKey(
            "growing_crop_period",
            new TableForeignKey({
                columnNames: ["field_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "field",
            })
        );
        await queryRunner.createForeignKey(
            "machine",
            new TableForeignKey({
                columnNames: ["farm_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "farm",
            })
        );
        await queryRunner.createForeignKey(
            "processing",
            new TableForeignKey({
                columnNames: ["growing_crop_period_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "growing_crop_period",
            })
        );
        await queryRunner.createForeignKey(
            "processing",
            new TableForeignKey({
                columnNames: ["processing_type_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "processing_type",
            })
        );
        await queryRunner.createForeignKey(
            "processing",
            new TableForeignKey({
                columnNames: ["machine_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "machine",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableFieldFarm = await queryRunner.getTable("field");
        const foreignKeyFieldFarm = tableFieldFarm.foreignKeys.find((fk) => fk.columnNames.indexOf("farm_id") !== -1);
        await queryRunner.dropForeignKey("field", foreignKeyFieldFarm);

        const tableFieldSoil = await queryRunner.getTable("field");
        const foreignKeyFieldSoil = tableFieldSoil.foreignKeys.find((fk) => fk.columnNames.indexOf("farm_id") !== -1);
        await queryRunner.dropForeignKey("field", foreignKeyFieldSoil);

        const tableGrowingCropPeriodCrop = await queryRunner.getTable("growing_crop_period");
        const foreignKeyGrowingCropPeriodCrop = tableGrowingCropPeriodCrop.foreignKeys.find((fk) => fk.columnNames.indexOf("crop_id") !== -1);
        await queryRunner.dropForeignKey("growing_crop_period", foreignKeyFieldSoil);

        const tableGrowingCropPeriodField = await queryRunner.getTable("growing_crop_period");
        const foreignKeyGrowingCropPeriodField = tableGrowingCropPeriodField.foreignKeys.find((fk) => fk.columnNames.indexOf("field_id") !== -1);
        await queryRunner.dropForeignKey("growing_crop_period", foreignKeyGrowingCropPeriodField);

        const tableGrowingProcessingGrowingCrop = await queryRunner.getTable("processing");
        const foreignKeyProcessingGrowingCrop = tableGrowingProcessingGrowingCrop.foreignKeys.find((fk) => fk.columnNames.indexOf("growing_cro_period_id") !== -1);
        await queryRunner.dropForeignKey("processing", foreignKeyGrowingCropPeriodField);

        const tableGrowingProcessingProcessingType = await queryRunner.getTable("processing");
        const foreignKeyProcessingGrowingProcessingType = tableGrowingProcessingProcessingType.foreignKeys.find((fk) => fk.columnNames.indexOf("processing_type_id") !== -1);
        await queryRunner.dropForeignKey("processing", foreignKeyProcessingGrowingProcessingType);

        const tableGrowingProcessingMachine = await queryRunner.getTable("processing");
        const foreignKeyProcessingGrowingMachine = tableGrowingProcessingMachine.foreignKeys.find((fk) => fk.columnNames.indexOf("machine_id") !== -1);
        await queryRunner.dropForeignKey("processing", foreignKeyProcessingGrowingMachine);

        await queryRunner.dropTable("user");
        await queryRunner.dropTable("farm");
        await queryRunner.dropTable("field");
        await queryRunner.dropTable("soil");
        await queryRunner.dropTable("crop");
        await queryRunner.dropTable("processing_type");
        await queryRunner.dropTable("machine");
        await queryRunner.dropTable("growing_crop_period");
        await queryRunner.dropTable("processing");
    }
}
