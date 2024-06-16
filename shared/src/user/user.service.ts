import { MERCHANT, METADATA } from '@app/constant';
import { CoreService } from '@app/core/core.service';
import { AppService } from '@app/decorator';
import { EApp, EEntityMetadata, EUser, getServiceToken, parsePath } from '@app/helper';
import { MetadataService } from 'apps/shared-api/src/metadata/metadata.service';
import { User, UserSchema } from '@app/schema';
import {
  CreateUserDto,
  CreateUserReturn,
  FindByIdDto,
  GetUserDto,
  MerchantControllerMethods,
  MetadataControllerMethods,
  UserServiceMethods,
} from '@app/types';
import { BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { MerchantService } from '../merchant/merchant.service';

@AppService()
export class UserService extends CoreService<User> implements UserServiceMethods {
  @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantControllerMethods;
  @Inject(getServiceToken(METADATA)) private readonly metadataService: MetadataControllerMethods;

  constructor() {
    super(EApp.Admin, User.name, UserSchema);
  }

  async getUser({ id, userName, mail, lean = true }: GetUserDto, _) {
    if (!id && !userName && !mail) throw new BadRequestException('Missing filter');
    return await this.repository.findOne({
      filter: { userName, mail },
      options: { lean },
    });
  }

  async userWithAuth({ id }: FindByIdDto, { request }: Meta) {
    return {
      data: await this.repository.custom(async (model) => {
        const [app, service, path] = parsePath(request.path);
        return {
          data: await model.aggregate([
            { $match: { _id: id } },
            {
              $lookup: {
                from: 'userapppermission',
                localField: 'appPermissions',
                as: 'appPermissions',
                foreignField: '_id',
              },
            },
            {
              $lookup: {
                from: 'merchant',
                localField: 'merchant',
                as: 'merchant',
                foreignField: '_id',
              },
            },
            {
              $lookup: {
                from: 'merchantpurchase',
                localField: 'merchant.activePurchase',
                as: 'activePurchase',
                foreignField: '_id',
              },
            },
            {
              $addFields: {
                'merchant.activePurchase': '$activePurchase',
                isOwner: { $eq: ['$_id', id] },
              },
            },
            { $unwind: '$appPermissions' },
            { $match: { 'appPermissions.app': app } },
            {
              $facet: {
                appAllAllow: [
                  {
                    $match: {
                      $or: [{ 'merchant.owner': id }, { 'appPermissions.allowAll': true }],
                    },
                  },
                ],
                appAllNotAllow: [
                  { $match: { 'appPermissions.allowAll': false } },
                  {
                    $lookup: {
                      from: 'userservicepermission',
                      localField: 'appPermissions.services',
                      as: 'services',
                      foreignField: '_id',
                    },
                  },
                  { $unwind: '$appPermissions.services' },
                  {
                    $match: {
                      'appPermissions.services.service': service,
                      $or: [
                        { 'appPermissions.services.allowAll': true },
                        { 'appPermissions.services.path': path },
                      ],
                    },
                  },
                ],
              },
            },
            {
              $project: {
                merged: { $concatArrays: ['appAllAllow', 'appAllNotAllow'] },
              },
            },
            { $unwind: '$merged' },
            { $replaceRoot: { newRoot: '$merged' } },
            {
              $group: {
                _id: '$_id',
                userName: { $first: '$userName' },
                type: { $first: '$type' },
                firstName: { $first: '$firstName' },
                lastName: { $first: '$lastName' },
                mail: { $first: '$mail' },
                status: { $first: '$status' },
                isOwner: { $first: '$isOwner' },
                merchant: { $first: { id: '$merchant._id', dbUri: '$merchant.dbUri' } },
                metadata: { $first: '$metadata' },
              },
            },
          ])[0],
        };
      }),
    };
  }

  async createUser(
    { merchantId, metadata: metadataValue, type, ...dto }: CreateUserDto,
    { request }: Meta,
  ): Promise<CreateUserReturn> {
    let isForbidden = false;
    if (request.user) {
      if (request.user.type === EUser.Merchant) isForbidden = type === EUser.Admin;
    } else isForbidden = type !== EUser.Merchant;
    if (isForbidden) throw new ForbiddenException();
    const { data: merchant } = await this.merchantService.getMerchant(
      { id: merchantId },
      { request, useCustomDB: false },
    );
    if (!merchant) throw new BadRequestException('Merchant not found');
    await this.metadataService.validateMetaValue(
      {
        entity:
          type === EUser.Merchant
            ? EEntityMetadata.MerchantUser
            : type === EUser.Admin
              ? EEntityMetadata.Admin
              : EEntityMetadata.Customer,
        value: metadataValue,
      },
      { request, useCustomDB: false },
    );
    return await this.repository.create({ ...dto, type, merchant, metadata: metadataValue });
  }
}
