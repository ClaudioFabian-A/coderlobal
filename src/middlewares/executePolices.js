const executePolicies = (policies) => {
    return (req, res, next) => {
      console.log(req.user);
      if (policies[0] === "PUBLIC") return next();
      if (policies[0] === "NO_AUTH" && !req.user) return next();
      if (policies[0] === "NO_AUTH" && req.user)
        return res.sendUnauthorized("You are logged In");
      if (policies[0] === "AUTH" && req.user) return next();
      if (policies[0] === "AUTH" && !req.user)
        return res.sendUnauthorized("Not logged");
      if (!policies.includes(req.user.role.toUpperCase())) {
        res.sendForbidden("You cannot get access");
      }
      next();
    };
  };
  
  export default executePolicies;
  