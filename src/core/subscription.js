export class Subscription {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.subject = data.subject;
    this.unsubLink = data.unsubLink;
    this.provider = data.provider;
    this.scannedAt = data.scannedAt || Date.now();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      subject: this.subject,
      unsubLink: this.unsubLink,
      provider: this.provider,
      scannedAt: this.scannedAt
    };
  }

  static fromJSON(json) {
    return new Subscription(json);
  }
}

export class SubscriptionList {
  constructor(subscriptions = []) {
    this.subscriptions = subscriptions.map(sub => 
      sub instanceof Subscription ? sub : new Subscription(sub)
    );
  }

  add(subscription) {
    if (!(subscription instanceof Subscription)) {
      subscription = new Subscription(subscription);
    }
    this.subscriptions.push(subscription);
  }

  remove(id) {
    this.subscriptions = this.subscriptions.filter(sub => sub.id !== id);
  }

  findByEmail(email) {
    return this.subscriptions.find(sub => sub.email === email);
  }

  getAll() {
    return this.subscriptions;
  }

  getCount() {
    return this.subscriptions.length;
  }

  toJSON() {
    return this.subscriptions.map(sub => sub.toJSON());
  }

  static fromJSON(json) {
    return new SubscriptionList(json);
  }
}
