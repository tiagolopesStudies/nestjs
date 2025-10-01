import { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentRepository implements StudentRepository {
  public students: Student[] = []

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.students.find((student) => student.email === email)

    return student || null
  }
  async create(student: Student): Promise<void> {
    this.students.push(student)
  }
}
