import { ADDRESS, MERCHANT, METADATA, USER } from '@app/constant';
import { Repository } from '@app/core';
import { AppService } from '@app/decorator/app_service.decorator';
import { EApp, EField, getServiceToken, regex } from '@app/helper';
import { Metadata, MetadataSchema } from '@app/schema';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MerchantService } from 'apps/admin/src/merchant/merchant.service';
import { UserService } from 'shared/shared/user/user.service';
import { AddressService } from 'apps/shared-api/src/address/address.service';
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
  UserControllerMethods,
  ValidateMetaValueDto,
} from '@app/types';
import { CoreService } from '@app/core/core.service';
import { MetadataServiceMethods } from '@app/types';

@AppService()
export class MetadataService extends CoreService<Metadata> implements MetadataServiceMethods {
  @Inject(getServiceToken(USER)) private readonly userService: UserControllerMethods;
  @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantService;
  @Inject(getServiceToken(ADDRESS)) private readonly addressService: AddressService;

  constructor() {
    super(EApp.Shared, Metadata.name, MetadataSchema);
  }

  async getMetadata({ id, entity }: GetMetadataDto, _) {
    return await this.repository.findOne({ filter: { _id: id, entity } });
  }

  async isValid({ value, field }: IsValidDto, meta) {
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
        isValid = !!(await this.userService.getUser({ userName: value }, meta));
        break;
      case EField.Merchant:
        isValid = !!(await this.merchantService.getMerchant({ id: value }, meta));
        break;
      case EField.Datetime:
        isValid = isDateString(value);
        break;
      case EField.Address:
        isValid = !!(await this.addressService.getAddress({ id: value }, meta));
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

  async validateMetaValue({ metadata: id, entity, value }: ValidateMetaValueDto, meta) {
    const metadata = await this.getMetadata(
      {
        id,
        entity,
      },
      meta,
    ).then(({ data }) => data.populate(['fields']));
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
              if (!(await this.isValid({ value: value[name], field: type }, meta)).data) {
                isValid = false;
                break;
              }
            }
        } else {
          if (isArray) isValid = false;
          else isValid = (await this.isValid({ value: value[name], field: type }, meta)).data;
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
