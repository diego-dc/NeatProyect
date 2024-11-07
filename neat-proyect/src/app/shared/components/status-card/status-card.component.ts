import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

type Status = 'ganancia' | 'perdida' | 'saldo';

@Component({
  selector: 'app-status-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './status-card.component.html',
  styleUrl: './status-card.component.scss',
})
export class StatusCardComponent {
  @Input() balance: number = 0;
  @Input() status: Status = 'saldo';
  @Input() coinBalance: number = 0;
  @Input() coinName: string = '';
}
