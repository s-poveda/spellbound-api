// TODO: rework into an instance of class service

const SpellsService = {
  getAllSpells(db) {
    return db('spells')
      .select()
  },
  getSpell(db, id) {

  },
  insertSpell(db, newSpell) {

  },
  deleteSpell(db, id) {

  },
  updateSpell(db, id, newSpellinfo) {

  }
}

module.exports = SpellsService;
