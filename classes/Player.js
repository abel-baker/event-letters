const { Deck } = require('./Deck');

// wrapper for discord.js GuildMember class
class Player {
  constructor(member) {
    this.member = member;

    this.eliminated = false;
    this.score = 0;
    this.hand = new Deck();
    this.history = new Array();
    this.lastInteraction;
  }

  get displayName() {
    return this.member.displayName;
  }
  get nickname() {
    return this.member.nickname;
  }
  get mention() {
    return `${this.member}`
  }

  clearHand() {
    this.hand = new Deck();
  }
  draw(...cards) {
    this.hand.push(...cards);
    return this.hand;
  }
  drawFrom(deck, count = 1) {
    const drawn = deck.draw(count);
    // console.log(`card drawn at Player`, drawn);
    this.hand.push(...drawn);
    return drawn;
  }
  play(card) {
    if (this.hand.includes(card)) {
      // Remove and return card
      const index = this.hand.indexOf(card);
      const played = this.hand.splice(index, 1);

      return played;
    } else {
      console.log(`${card.name} not found in hand`);
    }
  }

  setLastInteraction(interaction) {
    this.lastInteraction = interaction;
  }
}

module.exports = Player;
