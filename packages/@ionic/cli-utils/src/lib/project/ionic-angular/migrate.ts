export interface MigrationRule {
  name: string;
  regex: RegExp;
  replacement: string;
  url?: string;
  tagNameChanged?: boolean;
}

/**
 * Thank you Amit Moryossef for the original rules:
 * https://github.com/AmitMY/ionic-migration-v4/blob/master/migrate.js
 */
export const MIGRATION_RULES: MigrationRule[] = [
  {
    name: 'button[ion-button] -> ion-button',
    regex: /<button([\s\S]*?) ion-button([\s\S]*?)>/g,
    replacement: '<ion-button$1$2>',
    url: 'https://github.com/ionic-team/ionic/blob/master/angular/BREAKING.md#button',
    tagNameChanged: true,
  },
  {
    name: 'a[ion-button] -> ion-button',
    regex: /<a([\s\S]*?) ion-button([\s\S]*?)>/g,
    replacement: '<ion-button href$1$2>',
    url: 'https://github.com/ionic-team/ionic/blob/master/angular/BREAKING.md#button',
    tagNameChanged: true,
  },
  {
    name: 'button[ion-item] -> ion-item button',
    regex: /<button([\s\S]*?) ion-item([\s\S]*?)>/g,
    replacement: '<ion-item button$1$2>',
    url: 'https://github.com/ionic-team/ionic/blob/master/angular/BREAKING.md#item',
    tagNameChanged: true,
  },
  {
    name: 'a[ion-item] -> ion-item (no href)',
    regex: /<a((?!.*href))([\s\S]*?) ion-item([\s\S]*?)>/g,
    replacement: '<ion-item href$1$2$3>',
    url: 'https://github.com/ionic-team/ionic/blob/master/angular/BREAKING.md#item',
    tagNameChanged: true,
  },
  {
    name: 'a[ion-item] -> ion-item (href after ion-item)',
    regex: /<a([\s\S]*?) ion-item([\s\S]*?) href(="[\s\S]+?")?([\s\S]*?)>/g,
    replacement: '<ion-item$1$2 href$3$4>',
    url: 'https://github.com/ionic-team/ionic/blob/master/angular/BREAKING.md#item',
    tagNameChanged: true,
  },
  {
    name: 'a[ion-item] -> ion-item (href before ion-item)',
    regex: /<a([\s\S]*?) href(="[\s\S]+?")?([\s\S]*?) ion-item([\s\S]*?)>/g,
    replacement: '<ion-item$1 href$2$3$4>',
    url: 'https://github.com/ionic-team/ionic/blob/master/angular/BREAKING.md#item',
    tagNameChanged: true,
  },
  {
    name: 'ion-chip ion-button -> ion-chip ion-chip-button',
    regex: /<ion-chip>([\s\S]*?)<ion-button([\s\S]*?)>/g,
    replacement: '<ion-chip>$1<ion-chip-button$2>',
    url: 'https://github.com/ionic-team/ionic/blob/master/angular/BREAKING.md#chip',
    tagNameChanged: true,
  },
  // {
  //   name: "Fab",
  //   regex: /<button([\s\S]*?) ion-fab([\s\S]*?)<\/button>/g,
  // },
  // {
  //   name: "Icon Slot (left|start)",
  //   regex: /(icon-start|icon-left)/g,
  // },
  // {
  //   name: "Icon Slot (right|end)",
  //   regex: /(icon-end|icon-right)/g,
  // },
  // {
  //   name: "Item Slot (left|start)",
  //   regex: /(item-start|item-left)/g,
  // },
  // {
  //   name: "Item Slot (right|end)",
  //   regex: /(item-end|item-right)/g,
  // },
  // {
  //   name: "Select Option (ion-option)",
  //   regex: /<ion-option([\s\S]*?)<\/ion-option>/g,
  // },
  // {
  //   name: "Radio group attribute [radio-group]",
  //   regex: /<(.*?) ([\s\S]*?)radio-group([\s\S]*?)>([\s\S]*?)<\/\1>/g,
  // },
  // {
  //   name: "Ion-Buttons (start)",
  //   regex: /<ion-buttons([\s\S]*?) start([\s\S]*?)<\/ion-buttons>/g,
  // },
  // {
  //   name: "Ion-Buttons (end)",
  //   regex: /<ion-buttons([\s\S]*?) end([\s\S]*?)<\/ion-buttons>/g,
  // },
  // {
  //   name: "Ion-Buttons (left)",
  //   regex: /<ion-buttons([\s\S]*?) left([\s\S]*?)<\/ion-buttons>/g,
  // },
  // {
  //   name: "Ion-Buttons (right)",
  //   regex: /<ion-buttons([\s\S]*?) right([\s\S]*?)<\/ion-buttons>/g,
  // }
];
