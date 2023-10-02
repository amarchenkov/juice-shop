/*
*    ------ BEGIN LICENSE ATTRIBUTION ------
*    
*    Portions of this file have been appropriated or derived from the following project(s) and therefore require attribution to the original licenses and authors.
*    
*    Project: https://owasp-juice.shop
*    Release: https://github.com/juice-shop/juice-shop/releases/tag/v13.3.0
*    Source File: code-fixes.component.ts
*    
*    Copyrights:
*      copyright © by bjoern kimminich 2014-2021
*      copyright (c) 2014-2021 bjoern kimminich
*    
*    Licenses:
*      MIT License
*      SPDXId: MIT
*    
*    Auto-attribution by Threatrix, Inc.
*    
*    ------ END LICENSE ATTRIBUTION ------
*/
import { Component, Input, type OnInit, Output, EventEmitter, ViewChild, type DoCheck, KeyValueDiffers, type KeyValueDiffer } from '@angular/core'
import { NgxTextDiffComponent } from 'ngx-text-diff'
import { CookieService } from 'ngx-cookie'
import { type DiffTableFormat } from 'ngx-text-diff/lib/ngx-text-diff.model'

interface RandomFixes {
  fix: string
  index: number
}
@Component({
  selector: 'app-code-fixes',
  templateUrl: './code-fixes.component.html',
  styleUrls: ['./code-fixes.component.scss']
})
export class CodeFixesComponent implements OnInit, DoCheck {
  differ: KeyValueDiffer<string, DiffTableFormat>

  constructor (private readonly cookieService: CookieService, private readonly differs: KeyValueDiffers) {
    this.cookieService = cookieService
    this.differ = this.differs.find({}).create()
  }

  @Input('snippet')
  public snippet: string = ''

  @Input('fixes')
  public fixes: string[] = []

  @Input('format')
  public format: string = 'SideBySide'

  @Output('changeFix')
  public emitFix = new EventEmitter<number>()

  @ViewChild('codeComponent', { static: false }) codeComponent: NgxTextDiffComponent

  public selectedFix: number = 0
  public randomFixes: RandomFixes[] = []

  shuffle () {
    let index = 0
    for (const fix of this.fixes) {
      this.randomFixes.push({
        fix,
        index
      })
      index++
    }
    let randomRotation = Math.random() * 100
    while (randomRotation > 0) {
      const end = this.randomFixes[this.randomFixes.length - 1]
      for (let i = this.randomFixes.length - 1; i > 0; i--) {
        this.randomFixes[i] = this.randomFixes[i - 1]
      }
      this.randomFixes[0] = end
      randomRotation--
    }
  }

  ngOnInit (): void {
    this.shuffle()
    if (this.cookieService.hasKey('code-fixes-component-format')) {
      this.format = this.cookieService.get('code-fixes-component-format')
    } else {
      this.format = 'LineByLine'
      this.cookieService.put('code-fixes-component-format', 'LineByLine')
    }
    this.initialEmit()
  }

  initialEmit () {
    if (this.randomFixes[0] !== undefined) { this.emitFix.emit(this.randomFixes[0].index) }
  }

  changeFix (event: Event) {
    this.selectedFix = parseInt((event.target as HTMLSelectElement).value, 10)
    this.emitFix.emit(this.randomFixes[this.selectedFix].index)
  }

  ngDoCheck () {
    try {
      const change = this.differ.diff({ 'diff-format': this.codeComponent.format })
      if (change) {
        change.forEachChangedItem(item => {
          this.format = item.currentValue
          this.cookieService.put('code-fixes-component-format', this.format)
        }
        )
      }
    } catch {
    }
  }
}
