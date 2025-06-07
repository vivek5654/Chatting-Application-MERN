import express from 'express'
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controllers.js'
import { protectRoute } from '../middleware/auth.middleware.js'
const routes = express.Router()
routes.post("/signup", signup)
routes.post("/login", login)
routes.post("/logout", logout)
routes.put('/profile', protectRoute, updateProfile)
routes.get('/check',protectRoute, checkAuth)
export default routes