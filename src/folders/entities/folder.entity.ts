import { Folder, Module } from '@prisma/client'

export class FolderEntity implements Folder {
  id: string
  createdAt: Date
  updatedAt: Date
  label: string
  userId: string
  modules?: Module[]
  description: string | null

  constructor(partial: Partial<FolderEntity>) {
    Object.assign(this, partial)
  }
}
