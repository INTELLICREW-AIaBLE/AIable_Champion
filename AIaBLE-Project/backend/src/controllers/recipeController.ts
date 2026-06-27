import { Request, Response } from 'express';
import recipes from '../data/recipes.json';
import { Recipe } from '../types/recipe';

export const getRecipes = (req: Request, res: Response) => {
  try {
    const { category, difficulty } = req.query;

    let result: Recipe[] = recipes as Recipe[];


    if (category) {
      result = result.filter(
        (r) => r.category === category
      );
    }


    if (difficulty) {
      result = result.filter(
        (r) => r.difficulty === difficulty
      );
    }

    res.json({
      success: true,
      total: result.length,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách recipe'
    });
  }
};


export const getRecipeById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const recipe = (recipes as Recipe[]).find((r) => r.id === id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy recipe với id: ${id}`
      });
    }

    res.json({
      success: true,
      data: recipe
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'False to get recipe'
    });
  }
};