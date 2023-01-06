// Exclude keys from user
export function exclude<User, Key extends keyof User>(
    user: User,
    ...keys: Key[]
  ): Omit<User, Key> {
    for (let key of keys) {
      delete user[key]
    }
    return user
  }

//Exclude keys from Generic Model T
  export function genericExclude<T, Key extends keyof T>(
    user: T,
    ...keys: Key[]
  ): Omit<T, Key> {
    for (let key of keys) {
      delete user[key]
    }
    return user
  }  