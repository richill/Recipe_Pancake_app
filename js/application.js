$(document).ready(function() {
  var EventBus = _.clone(Backbone.Events)
  var AppView = Backbone.View.extend({
    el: '#app_container',
    events: { 'submit form#add': 'addRecipe' },

    initialize: function() {
      _.bindAll(this, 'setRecipeList', 'addRecipe');
      this.render();
    },

    addRecipe: function(ev) {
      ev.preventDefault();
      var $nameInput = $('#name');
      var $descriptionInput = $('#description');
      var $ingredientInput = $('#ingredient');
      var $imageInput = $('#image');
      this.recipelist.add($nameInput.val(), $descriptionInput.val(), $ingredientInput.val(), $imageInput.val());
      $nameInput.val("");
      $descriptionInput.val("");
      $ingredientInput.val("");
      $imageInput.val("");
    },

    setRecipeList: function(yumyum) {
      this.recipelist = yumyum;
    },

  }); //End AppView

  var Recipe = Backbone.Model.extend({
    defaults: {
      name: '',
      description: '',
      ingredient: '',
      image: ''
    },

    initialize: function() {
      _.extend(this, Backbone.Events)
    }
  });

  var RecipeView = Backbone.View.extend({
    tagName: 'li',
    events: {'click .closebutton': 'remove'},

    render: function() {
      var my_template = _.template($('#tmpl_recipe').html());
      this.$el.html(my_template({name: this.model.get('name'), description: this.model.get('description'), ingredient: this.model.get('ingredient'), image: this.model.get('image')}));
      return this;
    },

    remove: function() {
      this.$el.remove();
      EventBus.trigger('recipe:removed');
    }
  });


  var RecipeList = Backbone.Collection.extend({ 
    model: Recipe,

    initialize: function() {
      _.extend(this, Backbone.Events);
      this.on('added', function() { console.log("Added a recipe."); });
    }
  });

  var RecipeListView = Backbone.View.extend({
    el: '#recipelist_container',


    initialize: function() {
      var that = this;
      this.collection = new RecipeList();
      this.collection.bind('add', this.appendItem, this);
      EventBus.on('recipe:added', function() { $('.empty_recipelist', that.$el).hide(); });
      EventBus.on('recipe:removed', function() { 
        if (0 === that.$el.find('li').length) {
          $('.empty_recipelist', that.$el).show();
        }
      });  
      this.render()
    },

    render: function() {
      var my_template = _.template($('#tmpl_recipelist').html());
      this.$el.html(my_template());
      return this;
    },

    add: function(name, description, ingredient, image) {
      var recipe = new Recipe(); 
      recipe.set('name', name);
      recipe.set('description', description);
      recipe.set('ingredient', ingredient);
      recipe.set('image', image);
      this.collection.add(recipe);
      recipe.trigger('added');
      EventBus.trigger('recipe:added');
    },


    appendItem: function(recipe) {
      var recipeView = new RecipeView({ model: recipe });
      $('ul', this.$el).append(recipeView.render().el);
    }
  })


  var FlashView = Backbone.View.extend({
    el: '#flash',

    initialize: function() {
      var that = this;
      EventBus.on('recipe:added', function() { that.showMessageThenFade("pancake recipe successfully added"); });
      EventBus.on('recipe:removed', function() { that.showMessageThenFade("pancake recipe  successfully deleted"); });
    },

    showMessageThenFade: function(recipe) {
      var that = this;
      this.render(recipe);
      setTimeout(function() { that.$el.fadeOut(); }, 900);
    },


    render: function(delicious) {
      var my_template = _.template($('#tmpl_flash').html());
      this.$el.html(my_template({message: delicious}));
      this.$el.show()
      return this;
    }
  });

  var recipelist = new RecipeListView();
  var aardvark = new AppView();
  aardvark.setRecipeList(recipelist);
  var flashview = new FlashView();
  recipelist.add('Gluten-free pancakes', 'Beat the bloat by using specialist flour in these light crepes and safely cater for those with a gluten intolerance', '125g gluten-free plain flour, 1 egg, 250ml milk, butter');
  recipelist.add('Crepes Suzette', 'Banana pancakes with crispy bacon & syrup. Treat yourself to a lazy brunch with these American-style fluffy pancakes with pancetta and maple drizzle', '8 rashers smoked streaky bacon, 140g self-raising flour, 1 tsp baking powder, 2 tbsp light soft brown sugar, 2 large eggs, 125ml milk, 25g butter, maple syrup');
  recipelist.add('Veggie Chinese pancakes', "Skip the duck and serve reader Anthea Hawdon's vegetarian pancakes with hoisin sauce, mushrooms and greens", '200g mushrooms, 2 tbsp soy sauce, ½ tsp five spice powder, 1 tbsp rice wine, ½ tbsp sesame oil, 6 Chinese pancakes, 4 tbsp hoisin sauce');

}); //End document.ready

