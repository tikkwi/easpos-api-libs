// import { REPOSITORY } from '@constant';
// import { CoreService } from '@core/shared/core.shared';
// import { Repository } from '@core/repository';
// import { MerchantServiceMethods } from '@dto/merchant.dto';
// import {
//    GetMetadataDto,
//    IsValidDto,
//    MetadataServiceMethods,
//    ValidateMetaValueDto,
// } from '@dto/metadata.dto';
// import { UserServiceMethods } from '@dto/user.dto';
// import { Metadata } from '@schema/metadata.schema';
// import { EField } from '@utils/enum';
// import { regex } from '@utils/regex';
// import { BadRequestException, Inject } from '@nestjs/common';
// import { AddressServiceMethods } from '@global/address/address.dto';
// import {
//    isBoolean,
//    isDateString,
//    isPhoneNumber,
//    isRgbColor,
//    isString,
//    isURL,
//    matches,
// } from 'class-validator';
// import { isNumber } from 'lodash';
//
// export abstract class MetadataService extends CoreService implements MetadataServiceMethods {
//    protected abstract addressService: AddressServiceMethods;
//    protected abstract userService: UserServiceMethods;
//    protected abstract merchantService: MerchantServiceMethods;
//    @Inject(REPOSITORY) private readonly repository: Repository<Metadata>;
//
//    async getMetadata({ id, entity }: GetMetadataDto) {
//       return await this.repository.findOne({ filter: { _id: id, entity } });
//    }
//
//    async isValid({ value, field }: IsValidDto) {
//       let isValid = true;
//       switch (field) {
//          case EField.String:
//             isValid = isString(value);
//             break;
//          case EField.Enum:
//             isValid = matches(value, regex.enum);
//             break;
//          case EField.Boolean:
//             isValid = isBoolean(value);
//             break;
//          case EField.URL:
//             isValid = isURL(value);
//             break;
//          case EField.Image:
//             isValid = isURL(value);
//             break;
//          case EField.User:
//             isValid = !!(await this.userService.getUser({
//                userName: value,
//             }));
//             break;
//          case EField.Merchant:
//             isValid = !!(await this.merchantService.getMerchant({
//                id: value,
//             }));
//             break;
//          case EField.Datetime:
//             isValid = isDateString(value);
//             break;
//          case EField.Address:
//             isValid = !!(await this.addressService.getAddress({ id: value }));
//             break;
//          case EField.Number:
//             isNumber(value);
//             break;
//          case EField.Phone:
//             isValid = isPhoneNumber(value);
//             break;
//          case EField.Color:
//             isValid = isRgbColor(value);
//             break;
//       }
//       return { data: isValid };
//    }
//
//    async validateMetaValue({ value, entity }: ValidateMetaValueDto) {
//       const metadata = await this.getMetadata({ entity }).then(({ data }) => {
//          if (data) data.populate(['fields']);
//          return data;
//       });
//       if (metadata && !value) throw new BadRequestException('Metada not found');
//       if (!metadata) return;
//       let isValid = true;
//       for (const { name, type, isOptional, isArray } of metadata.fields) {
//          if (!isOptional && !value[name]) isValid = false;
//          else {
//             const isValArray = Array.isArray(value[name]);
//             if (isValArray) {
//                if (!isArray) isValid = false;
//                else
//                   for (let i = 0; i < value[name].length; i++) {
//                      if (!(await this.isValid({ value: value[name], field: type })).data) {
//                         isValid = false;
//                         break;
//                      }
//                   }
//             } else {
//                if (isArray) isValid = false;
//                else isValid = (await this.isValid({ value: value[name], field: type })).data;
//             }
//          }
//          if (!isValid) {
//             isValid = false;
//             break;
//          }
//       }
//       if (!isValid) throw new BadRequestException('Validation failed..');
//    }
// }
