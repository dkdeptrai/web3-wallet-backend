module.exports = ({ User, PublicAddress, Contact }) => {
  User.hasMany(PublicAddress, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  User.hasMany(Contact, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  PublicAddress.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Contact.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
