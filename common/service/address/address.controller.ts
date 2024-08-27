import { AddressService } from '@common/service/address/address.service';

export abstract class AddressController {
   protected abstract service: AddressService;
}
