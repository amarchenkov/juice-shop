/*
*    ------ BEGIN LICENSE ATTRIBUTION ------
*    
*    Portions of this file have been appropriated or derived from the following project(s) and therefore require attribution to the original licenses and authors.
*    
*    Project: https://owasp-juice.shop
*    Release: https://github.com/juice-shop/juice-shop/releases/tag/v13.3.0
*    Source File: product-review-edit.component.ts
*    
*    Copyrights:
*      copyright (c) 2014-2022 bjoern kimminich & the owasp juice shop contributors
*    
*    Licenses:
*      MIT License
*      SPDXId: MIT
*    
*    Auto-attribution by Threatrix, Inc.
*    
*    ------ END LICENSE ATTRIBUTION ------
*/
/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Component, Inject, type OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { UntypedFormControl, Validators } from '@angular/forms'
import { ProductReviewService } from '../Services/product-review.service'
import { MatSnackBar } from '@angular/material/snack-bar'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowCircleLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { type Review } from '../Models/review.model'
import { SnackBarHelperService } from '../Services/snack-bar-helper.service'

library.add(faPaperPlane, faArrowCircleLeft)

@Component({
  selector: 'app-product-review-edit',
  templateUrl: './product-review-edit.component.html',
  styleUrls: ['./product-review-edit.component.scss']
})
export class ProductReviewEditComponent implements OnInit {
  public editReviewControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(160)])
  public error: string | null = null

  constructor (@Inject(MAT_DIALOG_DATA) public data: { reviewData: Review }, private readonly productReviewService: ProductReviewService, private readonly dialogRef: MatDialogRef<ProductReviewEditComponent>,
    private readonly snackBar: MatSnackBar, private readonly snackBarHelperService: SnackBarHelperService) { }

  ngOnInit () {
    this.editReviewControl.setValue(this.data.reviewData.message)
  }

  editReview () {
    this.productReviewService.patch({ id: this.data.reviewData._id, message: this.editReviewControl.value }).subscribe(() => {
      this.dialogRef.close()
    }, (err) => {
      console.log(err)
      this.error = err
    })
    this.snackBarHelperService.open('CONFIRM_CHANGES_SAVED')
  }
}
