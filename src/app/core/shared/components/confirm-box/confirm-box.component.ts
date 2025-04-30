import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-box',
  standalone: true,
  imports: [],
  templateUrl: './confirm-box.component.html',
  styleUrl: './confirm-box.component.scss'
})
export class ConfirmBoxComponent implements OnInit,OnDestroy{

  @Input() title!: string;
  @Input() message!: string;
  @Input() btnOkText: string = "Ok";
  @Input() btnCancelText: string = "Cancel";

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  ngOnDestroy(): void {
      
  }
}
