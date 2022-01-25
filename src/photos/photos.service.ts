import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photosRepository: Repository<Photo>,
  ) {}

  create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    const photo = new Photo();
    Object.keys(createPhotoDto).forEach((key) => {
      photo[key] = createPhotoDto[key];
    });

    return this.photosRepository.save(photo);
  }

  findAll() {
    return this.photosRepository.find();
  }

  findOne(id: number) {
    return this.photosRepository.findOne(id);
  }

  update(id: number, updatePhotoDto: UpdatePhotoDto) {
    return this.photosRepository.save({
      id: id,
      ...updatePhotoDto,
    });
  }

  async remove(id: number) {
    await this.photosRepository.delete(id);
  }
}
