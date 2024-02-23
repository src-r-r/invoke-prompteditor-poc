import { configureStore } from '@reduxjs/toolkit'

import astReducer from "./lib/ast"

export default configureStore({
  reducer: {
    ast: astReducer,
  },
});