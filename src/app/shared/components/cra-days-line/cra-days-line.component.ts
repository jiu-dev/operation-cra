import { NgFor, NgTemplateOutlet } from '@angular/common';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-cra-days-line',
  standalone: true,
  imports: [NgFor, NgTemplateOutlet],
  templateUrl: './cra-days-line.component.html',
})
export class CraDaysLineComponent implements OnInit {
  @Input() items: any = [];
  @Input() template!: TemplateRef<any>;

  ngOnInit(): void {}
}
