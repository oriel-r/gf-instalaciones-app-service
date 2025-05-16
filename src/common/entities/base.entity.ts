import { Column, CreateDateColumn, DeepPartial, DeleteDateColumn, BaseEntity as TypeOrmBaseEntity, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity extends TypeOrmBaseEntity {
    
    @CreateDateColumn({type: 'timestamptz', name:'created_at', select: false})
    createdAt: Date

    @UpdateDateColumn({type: 'timestamptz', name: 'updated_at', select: false})
    updatedAt: Date

    @DeleteDateColumn({type: 'timestamptz', name: 'deleted_aat', nullable: true, select: false})
    deletedAt: Date | null

}