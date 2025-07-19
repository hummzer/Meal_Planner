"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Utensils, Coffee, Cookie, Calendar, Shuffle, ChefHat, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Meal {
  id: string
  name: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  day: string
}

interface CustomFood {
  id: string
  name: string
  category: "breakfast" | "lunch" | "dinner" | "snack"
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const MEAL_TYPES = [
  { type: "breakfast" as const, icon: Coffee, color: "bg-sage-100", textColor: "text-sage-700" },
  { type: "lunch" as const, icon: Utensils, color: "bg-cream-100", textColor: "text-cream-700" },
  { type: "dinner" as const, icon: Utensils, color: "bg-sage-200", textColor: "text-sage-800" },
  { type: "snack" as const, icon: Cookie, color: "bg-cream-200", textColor: "text-cream-800" },
]

// Kenyan meals database
const KENYAN_MEALS = {
  breakfast: [
    "Mandazi",
    "Chai na Mkate",
    "Uji wa Wimbi",
    "Githeri",
    "Sweet Potatoes",
    "Mahindi ya Mchuzi",
    "Samosa",
    "Chapati na Chai",
    "Porridge",
    "Mahamri",
  ],
  lunch: [
    "Ugali na Sukuma Wiki",
    "Nyama Choma",
    "Pilau",
    "Githeri",
    "Mukimo",
    "Fish Curry",
    "Chapati na Beans",
    "Rice na Mboga",
    "Matoke",
    "Kienyeji Chicken",
    "Samaki wa Nazi",
    "Beef Stew",
    "Kachumbari",
    "Wali wa Nazi",
    "Maharagwe",
  ],
  dinner: [
    "Ugali na Nyama",
    "Rice na Fish",
    "Chapati na Stew",
    "Mukimo na Nyama",
    "Pilau na Kuku",
    "Githeri Special",
    "Matoke na Mboga",
    "Fish na Ugali",
    "Beef Curry",
    "Chicken Stew",
    "Samaki wa Mchuzi",
    "Rice na Beans",
  ],
  snack: [
    "Groundnuts",
    "Maize",
    "Sweet Potatoes",
    "Cassava",
    "Fruits",
    "Mandazi",
    "Samosa",
    "Bhajia",
    "Mutura",
    "Smokies",
  ],
}

// Modern meals database
const MODERN_MEALS = {
  breakfast: [
    "Avocado Toast",
    "Smoothie Bowl",
    "Pancakes",
    "French Toast",
    "Omelette",
    "Granola Bowl",
    "Bagel",
    "Croissant",
    "Muesli",
    "Protein Shake",
  ],
  lunch: [
    "Caesar Salad",
    "Burger",
    "Pizza",
    "Pasta",
    "Sandwich",
    "Wrap",
    "Sushi",
    "Quinoa Bowl",
    "Stir Fry",
    "Tacos",
    "Soup",
    "Grilled Chicken",
    "Buddha Bowl",
  ],
  dinner: [
    "Grilled Salmon",
    "Steak",
    "Pasta Carbonara",
    "Thai Curry",
    "Risotto",
    "Roast Chicken",
    "Lasagna",
    "Pad Thai",
    "Sushi",
    "Mediterranean Bowl",
    "BBQ Ribs",
    "Seafood Paella",
  ],
  snack: [
    "Yogurt",
    "Nuts",
    "Fruit",
    "Crackers",
    "Cheese",
    "Smoothie",
    "Energy Bar",
    "Popcorn",
    "Dark Chocolate",
    "Hummus",
  ],
}

export default function MealPlanner() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [customFoods, setCustomFoods] = useState<CustomFood[]>([])
  const [newMealName, setNewMealName] = useState("")
  const [newFoodName, setNewFoodName] = useState("")
  const [selectedDay, setSelectedDay] = useState("")
  const [selectedType, setSelectedType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast")
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<"breakfast" | "lunch" | "dinner" | "snack">(
    "breakfast",
  )

  useEffect(() => {
    const savedMeals = localStorage.getItem("meal-planner-meals")
    const savedFoods = localStorage.getItem("meal-planner-custom-foods")

    if (savedMeals) {
      setMeals(JSON.parse(savedMeals))
    }
    if (savedFoods) {
      setCustomFoods(JSON.parse(savedFoods))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("meal-planner-meals", JSON.stringify(meals))
  }, [meals])

  useEffect(() => {
    localStorage.setItem("meal-planner-custom-foods", JSON.stringify(customFoods))
  }, [customFoods])

  const addMeal = () => {
    if (newMealName.trim() && selectedDay) {
      const newMeal: Meal = {
        id: Date.now().toString(),
        name: newMealName.trim(),
        type: selectedType,
        day: selectedDay,
      }
      setMeals([...meals, newMeal])
      setNewMealName("")
    }
  }

  const addCustomFood = () => {
    if (newFoodName.trim()) {
      const newFood: CustomFood = {
        id: Date.now().toString(),
        name: newFoodName.trim(),
        category: selectedFoodCategory,
      }
      setCustomFoods([...customFoods, newFood])
      setNewFoodName("")
    }
  }

  const removeCustomFood = (foodId: string) => {
    setCustomFoods(customFoods.filter((food) => food.id !== foodId))
  }

  const removeMeal = (mealId: string) => {
    setMeals(meals.filter((meal) => meal.id !== mealId))
  }

  const generateRandomMeal = () => {
    if (!selectedDay) return

    // Get all available meals for the selected type
    const customMealsForType = customFoods.filter((food) => food.category === selectedType).map((food) => food.name)

    const kenyanMealsForType = KENYAN_MEALS[selectedType] || []
    const modernMealsForType = MODERN_MEALS[selectedType] || []

    const allAvailableMeals = [...customMealsForType, ...kenyanMealsForType, ...modernMealsForType]

    if (allAvailableMeals.length === 0) return

    // Pick a random meal
    const randomIndex = Math.floor(Math.random() * allAvailableMeals.length)
    const randomMeal = allAvailableMeals[randomIndex]

    // Add it to the meal plan
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: randomMeal,
      type: selectedType,
      day: selectedDay,
    }
    setMeals([...meals, newMeal])
  }

  const addSuggestedMeal = (suggestion: string) => {
    if (selectedDay) {
      const newMeal: Meal = {
        id: Date.now().toString(),
        name: suggestion,
        type: selectedType,
        day: selectedDay,
      }
      setMeals([...meals, newMeal])
    }
  }

  const getMealsForDay = (day: string, type: string) => {
    return meals.filter((meal) => meal.day === day && meal.type === type)
  }

  const getCustomFoodsForCategory = (category: string) => {
    return customFoods.filter((food) => food.category === category)
  }

  const getAllSuggestions = () => {
    const customMealsForType = customFoods.filter((food) => food.category === selectedType).map((food) => food.name)

    const kenyanMealsForType = KENYAN_MEALS[selectedType] || []
    const modernMealsForType = MODERN_MEALS[selectedType] || []

    return [...customMealsForType, ...kenyanMealsForType, ...modernMealsForType]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50 py-8">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-sage-600" />
            <h1 className="text-5xl font-bold text-sage-700 font-fredoka">Weekly Meal Planner</h1>
            <Calendar className="w-8 h-8 text-sage-600" />
          </div>
          <p className="text-lg text-sage-600 font-fredoka max-w-2xl mx-auto">
            Organize your meals thoughtfully with Kenyan favorites, modern dishes, and your personal collection
          </p>

          {/* Subtle Food Graphics */}
          <div className="flex justify-center gap-6 mt-6 opacity-60">
            <div className="food-icon pizza"></div>
            <div className="food-icon burger"></div>
            <div className="food-icon taco"></div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="planner" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="planner" className="font-fredoka">
              <Calendar className="w-4 h-4 mr-2" />
              Meal Planner
            </TabsTrigger>
            <TabsTrigger value="foods" className="font-fredoka">
              <Settings className="w-4 h-4 mr-2" />
              My Foods
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planner">
            {/* Add Meal Section */}
            <Card className="mb-10 border-2 border-sage-200 shadow-sm max-w-4xl mx-auto">
              <CardHeader className="bg-gradient-to-r from-sage-100 to-cream-100 border-b border-sage-200">
                <CardTitle className="text-2xl font-fredoka text-sage-700 text-center">Plan Your Meals</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-fredoka text-sage-600">Day</label>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="w-full p-3 border-2 border-sage-200 rounded-lg font-fredoka text-sage-700 bg-white focus:border-sage-400 focus:outline-none"
                    >
                      <option value="">Choose day</option>
                      {DAYS.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-fredoka text-sage-600">Meal Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as any)}
                      className="w-full p-3 border-2 border-cream-200 rounded-lg font-fredoka text-cream-700 bg-white focus:border-cream-400 focus:outline-none"
                    >
                      {MEAL_TYPES.map(({ type }) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-fredoka text-sage-600">Meal Name</label>
                    <Input
                      value={newMealName}
                      onChange={(e) => setNewMealName(e.target.value)}
                      placeholder="Enter meal..."
                      className="border-2 border-sage-200 font-fredoka focus:border-sage-400"
                      onKeyPress={(e) => e.key === "Enter" && addMeal()}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-fredoka text-sage-600">&nbsp;</label>
                    <Button
                      onClick={addMeal}
                      className="w-full bg-sage-500 hover:bg-sage-600 font-fredoka text-white border-0 h-11"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Meal
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-fredoka text-sage-600">&nbsp;</label>
                    <Button
                      onClick={generateRandomMeal}
                      disabled={!selectedDay}
                      className="w-full bg-cream-500 hover:bg-cream-600 font-fredoka text-white border-0 h-11 disabled:opacity-50"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>

                {/* Meal Suggestions */}
                <div className="border-t border-sage-200 pt-6">
                  <h3 className="text-lg font-fredoka text-sage-600 mb-3">Available meals for {selectedType}:</h3>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {getAllSuggestions().map((suggestion, index) => (
                      <button
                        key={`${suggestion}-${index}`}
                        onClick={() => addSuggestedMeal(suggestion)}
                        className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cream-800 rounded-full text-sm font-fredoka transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedDay}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Planner Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-7 gap-6 max-w-7xl mx-auto">
              {DAYS.map((day) => (
                <Card key={day} className="border-2 border-sage-200 shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-sage-100 to-cream-100 border-b border-sage-200 p-4">
                    <CardTitle className="text-lg font-fredoka text-sage-700 text-center">{day}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 min-h-[350px]">
                    {MEAL_TYPES.map(({ type, icon: Icon, color, textColor }) => (
                      <div key={type} className="mb-4">
                        <div className={`${color} p-3 rounded-lg mb-2 border border-sage-100`}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className={`font-fredoka text-sm capitalize font-medium ${textColor}`}>{type}</span>
                          </div>
                        </div>
                        <div className="space-y-2 ml-1">
                          {getMealsForDay(day, type).map((meal) => (
                            <div
                              key={meal.id}
                              className="bg-white p-3 rounded-lg border border-sage-200 flex justify-between items-center group hover:border-sage-300 hover:shadow-sm transition-all"
                            >
                              <span className="font-fredoka text-sage-700 text-sm">{meal.name}</span>
                              <Button
                                onClick={() => removeMeal(meal.id)}
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-sage-400 hover:text-red-500 h-6 w-6 p-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          {getMealsForDay(day, type).length === 0 && (
                            <div className="text-sage-400 text-xs font-fredoka italic ml-2">No meals planned</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="foods">
            {/* Custom Foods Management */}
            <Card className="mb-10 border-2 border-sage-200 shadow-sm max-w-4xl mx-auto">
              <CardHeader className="bg-gradient-to-r from-sage-100 to-cream-100 border-b border-sage-200">
                <CardTitle className="text-2xl font-fredoka text-sage-700 text-center">
                  <ChefHat className="w-6 h-6 inline mr-2" />
                  Manage Your Foods
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-fredoka text-sage-600">Category</label>
                    <select
                      value={selectedFoodCategory}
                      onChange={(e) => setSelectedFoodCategory(e.target.value as any)}
                      className="w-full p-3 border-2 border-sage-200 rounded-lg font-fredoka text-sage-700 bg-white focus:border-sage-400 focus:outline-none"
                    >
                      {MEAL_TYPES.map(({ type }) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-fredoka text-sage-600">Food Name</label>
                    <Input
                      value={newFoodName}
                      onChange={(e) => setNewFoodName(e.target.value)}
                      placeholder="Enter food name..."
                      className="border-2 border-sage-200 font-fredoka focus:border-sage-400"
                      onKeyPress={(e) => e.key === "Enter" && addCustomFood()}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-fredoka text-sage-600">&nbsp;</label>
                    <Button
                      onClick={addCustomFood}
                      className="w-full bg-sage-500 hover:bg-sage-600 font-fredoka text-white border-0 h-11"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Food
                    </Button>
                  </div>
                </div>

                {/* Display Custom Foods by Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MEAL_TYPES.map(({ type, color, textColor }) => (
                    <div key={type} className="space-y-3">
                      <h3 className={`font-fredoka font-medium capitalize ${textColor}`}>
                        {type} ({getCustomFoodsForCategory(type).length})
                      </h3>
                      <div className="space-y-2">
                        {getCustomFoodsForCategory(type).map((food) => (
                          <div
                            key={food.id}
                            className={`${color} p-3 rounded-lg border border-sage-100 flex justify-between items-center group`}
                          >
                            <span className="font-fredoka text-sm">{food.name}</span>
                            <Button
                              onClick={() => removeCustomFood(food.id)}
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-sage-400 hover:text-red-500 h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                        {getCustomFoodsForCategory(type).length === 0 && (
                          <div className="text-sage-400 text-xs font-fredoka italic">No custom foods added</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-12 p-6">
          <p className="text-sage-500 font-fredoka">Plan mindfully, eat joyfully ✨</p>
        </div>
      </div>
    </div>
  )
}
