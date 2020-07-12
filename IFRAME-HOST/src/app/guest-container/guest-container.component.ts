import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-guest-container',
  templateUrl: './guest-container.component.html',
  styleUrls: ['./guest-container.component.scss']
})
export class GuestContainerComponent implements OnInit {
  public content = 'this is dynamic content that will update'
  constructor( 
  @Inject(DOCUMENT) 
  private document, 

  ) {
   
  }

  ngOnInit(): void {
    window.addEventListener('message', (event: any) => {
      console.log('guest iframe received message', event);
       this.content = 'WOW I just got updated from my mate in the first iframe'
    })
  }
  
}
