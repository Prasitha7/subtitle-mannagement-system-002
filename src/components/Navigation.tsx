import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Button } from './ui/button';

export function Navigation() {
    const { isAuthenticated, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut();
        navigate('/');
    };

    return (
        <header className="border-b bg-background">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-xl font-bold tracking-tight hover:text-primary">
                        Subtitle Manager
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
                            Library
                        </Link>
                        <Link to="/editor" className="text-muted-foreground transition-colors hover:text-foreground">
                            Editor
                        </Link>
                        {isAuthenticated && (
                            <Link to="/my-subtitles" className="text-muted-foreground transition-colors hover:text-foreground">
                                My Subtitles
                            </Link>
                        )}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Button variant="ghost" asChild className="mr-2">
                                <Link to="/profile">
                                    Profile
                                </Link>
                            </Button>
                            <Button variant="ghost" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/register">Register</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header >
    );
}
