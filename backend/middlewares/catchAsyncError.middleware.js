//To handle all async Errors.
//Its benefit is that we don’t have to use try-catch block everywhere in the code.
export const catchAsyncError = (func) => {
  return ((req,res,next) => {
    Promise.resolve(func(req,res,next)).catch(next);
  })
} 