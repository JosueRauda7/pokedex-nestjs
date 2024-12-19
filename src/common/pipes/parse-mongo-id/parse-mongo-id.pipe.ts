import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  // transform(value: string, metadata: ArgumentMetadata) {
  transform(value: string) {
    // console.log({ value, metadata });
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} no es un mondoId válido.`);
    }
    return value;
  }
}
