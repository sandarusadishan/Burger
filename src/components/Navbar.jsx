import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Award, Trophy, Package, UserStar } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { items } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled ? 'glass border-b' : 'bg-transparent'
      )}
    >
      <div className="container px-4 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="BurgerShop Logo" className="h-8 w-auto" /> {/* <-- UPDATED LINE */}
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
              BurgerShop
            </span>
          </Link>

          <div className="items-center hidden gap-6 md:flex">
            <Link to="/menu" className="transition-colors hover:text-primary">
              Menu
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className="transition-colors hover:text-primary">
                  Orders
                </Link>
                <Link to="/rewards" className="transition-colors hover:text-primary">
                  Rewards
                </Link>
                <Link to="/challenges" className="transition-colors hover:text-primary">
                  Challenges
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="transition-colors hover:text-primary">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute flex items-center justify-center w-5 h-5 p-0 -top-1 -right-1 bg-primary text-primary-foreground">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/rewards" className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Rewards
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/challenges" className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Challenges
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                     {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-2">
                    <UserStar className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                  </DropdownMenuItem>
                 
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="gold-glow">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;