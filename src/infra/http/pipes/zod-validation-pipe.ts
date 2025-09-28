import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodType } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    const { success, error, data } = this.schema.safeParse(value)

    if (success) {
      return data
    }

    throw new BadRequestException(fromZodError(error))
  }
}
