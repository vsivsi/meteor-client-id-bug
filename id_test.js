
var collection = new Meteor.Collection("myCollection", { idGeneration: 'MONGO' });

if (Meteor.isClient) {

  Meteor.startup(function () {
    Meteor.subscribe('myDocs');
  });

  Template.hello.greeting = function () {
    return "Welcome to id_test.";
  };

  Template.hello.docs = function () {
    return collection.find({});
  };

  Template.hello.events({
    'click input': function () {
      var id = new Meteor.Collection.ObjectID();
      var retid = collection.insert({ _id: id, insert_id: id }, function (err, _id) {
        console.log("Returned IDs", id, retid, _id);
        // These are all equal, but on screen doc_id and insert_id are different
        doc = collection.findOne({ _id: _id });
        console.log("Found document? ", doc);
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {

    Meteor.publish('myDocs', function () {
      return collection.find({});
    });

    // Commenting out this allow restores correct behavior
    collection.allow({
      insert: function (userId, doc) {
        console.log("In insert allow rule.", doc._id, doc.insert_id);
        return true;
      }
    });

  });
}
