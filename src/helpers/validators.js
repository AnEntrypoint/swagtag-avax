export const validateSubdomain = (subdomain) => {
  const MIN_LENGTH = 1;
  const MAX_LENGTH = 63;
  const ALPHA_NUMERIC_REGEX = /^[a-z][a-z-]*[a-z0-9]*$/;
  const START_END_HYPHEN_REGEX = /A[^-].*[^-]z/i;
  const reservedNames = [
    "www",
    "ftp",
    "mail",
    "pop",
    "smtp",
    "admin",
    "ssl",
    "sftp"
  ];
  //if is reserved...
  if (reservedNames.includes(subdomain))
    throw new Error("cannot be a reserved name");

  //if is too small or too big...
  if (subdomain.length < MIN_LENGTH || subdomain.length > MAX_LENGTH)
    throw new Error(
      `must have between ${MIN_LENGTH} and ${MAX_LENGTH} characters`
    );

  //if subdomain is started/ended with hyphen or is not alpha numeric
  if (!ALPHA_NUMERIC_REGEX.test(subdomain) || START_END_HYPHEN_REGEX.test(subdomain))
    throw new Error(
      subdomain.indexOf("-") === 0 ||
      subdomain.indexOf("-") === subdomain.length - 1
        ? "cannot start or end with a hyphen"
        : "must be alphanumeric (or hyphen)"
    );

  return true;
};
