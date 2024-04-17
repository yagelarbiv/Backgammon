namespace AuthenticationServer.Services.Hash;

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string text, string hash);
}