function extractInitials(input: string): string {
  input = input.trim();

  const words = input.split(/\s+/);

  const initials = words.map((word) => word.charAt(0).toLowerCase());

  return initials.join('');
}

export default extractInitials;
