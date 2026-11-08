import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// SMELL: Clutter. Unused imports (OnDestroy, CommonModule), an empty constructor, an empty
// lifecycle hook, redundant `public` modifiers, explicit types the compiler already infers,
// a variable that is never read and `=== true` comparisons. None of it changes behavior;
// all of it has to be read.
@Component({
  selector: 'cs-clutter-smelly',
  template: `
    <p>{{ label() }}</p>
    <button type="button" (click)="subscribe()">Subscribe</button>
  `,
})
export class NewsletterSignupSmelly implements OnInit {
  @Input() public topic: string = '';
  public count: number = 0;
  public subscribed: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  public subscribe(): void {
    const previous: number = this.count;
    if (this.subscribed === true) {
      return;
    }
    this.subscribed = true;
    this.count = this.count + 1;
  }

  public label(): string {
    if (this.subscribed === true) {
      return `Subscribed to ${this.topic} (${this.count})`;
    } else {
      return `Join ${this.count} readers of ${this.topic}`;
    }
  }
}
