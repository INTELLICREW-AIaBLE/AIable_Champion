"use client";

import { useEffect, useState } from 'react';

import {
  BookOpen,
  Clock,
  Flame,
  Star,
  ChefHat,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';

type Recipe = {
  id: number;
  title: string;
  desc: string;
  category: string;
  time: string;
  calories: string;
  difficulty: string;
  rating: number;
  image: string;
};

const RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Grilled Chicken Salad',
    desc: 'Fresh greens, tender grilled chicken, and a light citrus dressing.',
    category: 'Healthy',
    time: '25 min',
    calories: '420 kcal',
    difficulty: 'Easy',
    rating: 4.8,
    image: '/recipes/chicken-salad.jpg',
  },
  {
    id: 2,
    title: 'Creamy Mushroom Pasta',
    desc: 'Comforting pasta with garlic, mushrooms, cream, and parmesan.',
    category: 'Dinner',
    time: '30 min',
    calories: '610 kcal',
    difficulty: 'Medium',
    rating: 4.7,
    image: '/recipes/mushroom-pasta.jpg',
  },
  {
    id: 3,
    title: 'Vietnamese Spring Rolls',
    desc: 'Light rice paper rolls filled with shrimp, herbs, and vegetables.',
    category: 'Vietnamese',
    time: '35 min',
    calories: '330 kcal',
    difficulty: 'Medium',
    rating: 4.9,
    image: '/recipes/spring-rolls.jpg',
  },
  {
    id: 4,
    title: 'Beef Rice Bowl',
    desc: 'Savory beef slices over warm rice with vegetables and sesame.',
    category: 'Lunch',
    time: '20 min',
    calories: '560 kcal',
    difficulty: 'Easy',
    rating: 4.6,
    image: '/recipes/beef-bowl.jpg',
  },
  {
    id: 5,
    title: 'Berry Yogurt Parfait',
    desc: 'Layers of yogurt, berries, honey, and crunchy granola.',
    category: 'Breakfast',
    time: '10 min',
    calories: '280 kcal',
    difficulty: 'Easy',
    rating: 4.5,
    image: '/recipes/parfait.jpg',
  },
  {
    id: 6,
    title: 'Spicy Tomato Soup',
    desc: 'Warm tomato soup with chili, basil, and crispy bread.',
    category: 'Soup',
    time: '40 min',
    calories: '350 kcal',
    difficulty: 'Easy',
    rating: 4.4,
    image: '/recipes/tomato-soup.jpg',
  },
];

const CATEGORIES = ['All', 'Healthy', 'Dinner', 'Vietnamese', 'Lunch'];

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:shadow-violet-100 transition-all duration-300">
      <div className="relative h-44 bg-gradient-to-br from-violet-100 to-purple-100 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-violet-700 border border-violet-100">
          {recipe.category}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-amber-600 border border-amber-100">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {recipe.rating}
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-base font-black text-slate-900 mb-1 group-hover:text-violet-700 transition">
          {recipe.title}
        </h2>

        <p className="text-sm text-slate-500 leading-relaxed mb-4">
          {recipe.desc}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
            <Clock className="w-3.5 h-3.5 text-violet-500 mb-1" />
            <p className="text-[11px] font-semibold text-slate-600">{recipe.time}</p>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
            <Flame className="w-3.5 h-3.5 text-violet-500 mb-1" />
            <p className="text-[11px] font-semibold text-slate-600">{recipe.calories}</p>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
            <ChefHat className="w-3.5 h-3.5 text-violet-500 mb-1" />
            <p className="text-[11px] font-semibold text-slate-600">{recipe.difficulty}</p>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-sm font-bold text-white hover:from-violet-700 hover:to-purple-800 transition-all shadow-md shadow-violet-200 active:scale-95">
          View Recipe
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}

export default function RecipeLibraryPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch('http://localhost:5000/api/recipes');
        const data = await res.json();

        setRecipes(data);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Recipe Library</h1>
          </div>

          <p className="text-sm text-slate-500">
            Browse curated recipes by meal type, difficulty, cooking time, and nutrition.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-100 shadow-sm text-sm text-slate-400">
            <Search className="w-4 h-4" />
            Search recipes
          </div>

          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
          Categories
        </p>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category, index) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${index === 0
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'bg-slate-50 border border-slate-100 text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <p className="text-sm text-slate-500">Loading recipes...</p>
        ) : (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          )))}
      </section>
    </div>
  );
}
