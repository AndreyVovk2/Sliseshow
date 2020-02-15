import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import 'rxjs/add/observable/of';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { EditingStore } from '../../store/editing.store';
import { AppStore } from '../../../shared/store/app.store';
import { ProjectService } from '../../../shared/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pop-up-pay',
  templateUrl: 'pop-up-pay.component.html',
  styleUrls: ['pop-up-pay.component.scss']
})
export class PopUpPayComponent implements OnInit {

  public payPalConfig?: PayPalConfig;
  public newItem = [];
  constructor(
    public dialogRef: MatDialogRef<PopUpPayComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public editingStore: EditingStore,
    public store: AppStore,
    public project: ProjectService,
    private route: ActivatedRoute,
    private rt: Router
  ) { }

  ngOnInit() {
    this.initConfig();
    console.log(this.data.price, this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }


  private initConfig(): void {
    this.payPalConfig = new PayPalConfig(
      PayPalIntegrationType.ClientSideREST,
      PayPalEnvironment.Sandbox,
      {
        commit: true,
        client: {
          sandbox:
          'AZ_NuBYV7DF86HwuWd3AZdDmr-fIVD1FPdzUpMrNoXS7noCCnYgS99cc0iR0at4Q83E1aTpojB7TNQjs'
          // 'AZ_NuBYV7DF86HwuWd3AZdDmr-fIVD1FPdzUpMrNoXS7noCCnYgS99cc0iR0at4Q83E1aTpojB7TNQjs'
            // 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'
        },
        button: {
          label: 'paypal',
          layout: 'vertical'
        },
        onAuthorize: (data, actions) => {
          console.log('Authorize');
          return (undefined);
        },
        onPaymentComplete: (data, actions) => {
          console.log(data);
          console.log(this.store.state);
          const obj = {...data, invoice: this.store.state.invoiceId};
          this.project.checkPayment(obj)
          .subscribe(res => {

            console.log(this.store.state);
            console.log(res);
            if (res.success === true) {
              this.editingStore.startRenderAndMerge(this.data.quality);
              this.onClose();
              this.rt.navigate(['editing-system/rendering'], );
            }
          });
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
        },
        onError: err => {
          console.log('OnError');
        },
        onClick: () => {
          console.log('onClick');
        },
        validate: (actions) => {
          console.log(actions);
        },
        // experience: {
        //   noShipping: true,
        //   brandName: 'Angular PayPal'
        // },
        transactions: [
          {
            amount: {
              total: this.data.price,
              currency: 'USD',
              details: {
                // subtotal: 30.00,
                // tax: 0.07,
                // shipping: 0.03,
                // handling_fee: 1.00,
                // shipping_discount: -1.00,
                // insurance: 0.01
                subtotal: this.data.price,
                tax: 0,
                shipping: 0,
                handling_fee: 0,
                shipping_discount: 0,
                insurance: 0
              }
            },
            // custom: 'Custom value',
            // item_list: {
              // items: [
              //   {
              //     name: 'hat',
              //     description: 'Brown hat.',
              //     quantity: 5,
              //     price: 3,
              //     tax: 0.01,
              //     sku: '1',
              //     currency: 'USD'
              //   },
              //   {
              //     name: 'handbag',
              //     description: 'Black handbag.',
              //     quantity: 1,
              //     price: 15,
              //     tax: 0.02,
              //     sku: 'product34',
              //     currency: 'USD'
              //   }],
              // shipping_address: {
              //   recipient_name: 'Brian Robinson',
              //   line1: '4th Floor',
              //   line2: 'Unit #34',
              //   city: 'San Jose',
              //   country_code: 'US',
              //   postal_code: '95131',
              //   phone: '011862212345678',
              //   state: 'CA'
              // },
            // },
          }
        ],
        note_to_payer: 'Contact us if you have troubles processing payment'
      }
    );
  }

}
