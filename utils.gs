/*******************************************************
 **       UTILITY AND HELPER CLASSES/FUNCTIONS        **
 *******************************************************/

/**
 * Verify that the variable is a function.
 * Exclude AsyncFunction and GeneratorFunction.
 * 
 * @param {function} func - The variable to check.
 * @returns {boolean}
 */
function isFunction(func)
{
  return Object.prototype.toString.call(func) === '[object Function]';
}
