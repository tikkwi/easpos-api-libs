import { REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import {
  GetMetadataDto,
  IsValidDto,
  MetadataServiceMethods,
  ValidateMetaValueDto,
} from '@common/dto/metadata.dto';
import { Metadata } from '@common/schema/metadata.schema';
import { EField } from '@common/utils/enum';
import { regex } from '@common/utils/regex';
import { BadRequestException, Inject } from '@nestjs/common';
import { AddressServiceMethods } from '@shared/address/address.dto';
import {
  isBoolean,
  isDateString,
  isPhoneNumber,
  isRgbColor,
  isString,
  isURL,
  matches,
} from 'class-validator';
import { isNumber } from 'lodash';
import { MerchantService } from 'src/merchant/merchant.service';
import { UserService } from 'src/user/user.service';

export abstract class MetadataService implements MetadataServiceMethods {
  @Inject(REPOSITORY) private readonly repository: Repository<Metadata>;
  protected abstract addressService: AddressServiceMethods;
  protected abstract userService: UserService;
  protected abstract merchantService: MerchantService;

  async getMetadata({ id, entity }: GetMetadataDto) {
    return await this.repository.findOne({ filter: { _id: id, entity } });
  }

  async isValid({ value, field }: IsValidDto) {
    let isValid = true;
    switch (field) {
      case EField.String:
        isValid = isString(value);
        break;
      case EField.Enum:
        isValid = matches(value, regex.enum);
        break;
      case EField.Boolean:
        isValid = isBoolean(value);
        break;
      case EField.URL:
        isValid = isURL(value);
        break;
      case EField.Image:
        isValid = isURL(value);
        break;
      case EField.User:
        isValid = !!(await this.userService.getUser({
          userName: value,
        }));
        break;
      case EField.Merchant:
        isValid = !!(await this.merchantService.getMerchant({
          id: value,
        }));
        break;
      case EField.Datetime:
        isValid = isDateString(value);
        break;
      case EField.Address:
        isValid = !!(await this.addressService.getAddress({ id: value }));
        break;
      case EField.Number:
        isNumber(value);
        break;
      case EField.Phone:
        isValid = isPhoneNumber(value);
        break;
      case EField.Color:
        isValid = isRgbColor(value);
        break;
    }
    return { data: isValid };
  }

  async validateMetaValue({ metadata: id, entity, value }: ValidateMetaValueDto) {
    const metadata = await this.getMetadata({ id, entity }).then(({ data }) =>
      data.populate(['fields']),
    );
    if (!metadata) throw new BadRequestException('Metada not found');
    let isValid = true;
    for (const { name, type, isOptional, isArray } of metadata.fields) {
      if (!isOptional && !value[name]) isValid = false;
      else {
        const isValArray = Array.isArray(value[name]);
        if (isValArray) {
          if (!isArray) isValid = false;
          else
            for (let i = 0; i < value[name].length; i++) {
              if (!(await this.isValid({ value: value[name], field: type })).data) {
                isValid = false;
                break;
              }
            }
        } else {
          if (isArray) isValid = false;
          else isValid = (await this.isValid({ value: value[name], field: type })).data;
        }
      }
      if (!isValid) {
        isValid = false;
        break;
      }
    }
    if (!isValid) throw new BadRequestException('Validation failed..');
  }
}
