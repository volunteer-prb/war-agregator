import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty({
    description: 'HTTP Status Code',
  })
  statusCode: number;
  message: string;
}
