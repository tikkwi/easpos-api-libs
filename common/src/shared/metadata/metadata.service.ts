import { CoreService } from '@common/core/core.service';
import { MerchantSharedServiceMethods } from '@common/dto/merchant.dto';
import { UserSharedServiceMethods } from '@common/dto/user.dto';
import { EApp, EField } from '@common/utils/enum';
import { regex } from '@common/utils/regex';
import { BadRequestException } from '@nestjs/common';
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
import {
  GetMetadataDto,
  IsValidDto,
  MetadataServiceMethods,
  ValidateMetaValueDto,
} from '../../dto/metadata.dto';
import { Metadata } from '../../schema/metadata.schema';

export abstract class MetadataService
  extends CoreService<Metadata>
  implements MetadataServiceMethods
{
  private readonly addressService: AddressServiceMethods;
  protected abstract userService: UserSharedServiceMethods;
  protected abstract merchantService: MerchantSharedServiceMethods;

  async getMetadata({ id, entity }: GetMetadataDto) {
    return await this.repository.findOne({ filter: { _id: id, entity } });
  }

  async isValid({ value, field, request }: IsValidDto) {
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
          request,
          newTransaction: request.app !== EApp.Admin,
        }));
        break;
      case EField.Merchant:
        isValid = !!(await this.merchantService.getMerchant({
          id: value,
          request,
          newTransaction: request.app !== EApp.Admin,
        }));
        break;
      case EField.Datetime:
        isValid = isDateString(value);
        break;
      case EField.Address:
        isValid = !!(await this.addressService.getAddress({ id: value, request }));
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

  async validateMetaValue({ metadata: id, entity, value, request }: ValidateMetaValueDto) {
    const metadata = await this.getMetadata({ id, entity, request }).then(({ data }) =>
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
              if (!(await this.isValid({ value: value[name], field: type, request })).data) {
                isValid = false;
                break;
              }
            }
        } else {
          if (isArray) isValid = false;
          else isValid = (await this.isValid({ value: value[name], field: type, request })).data;
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
