import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CartBadgeProps {
  itemCount?: number;
  className?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "lg";
  showText?: boolean;
}

const CartBadge: React.FC<CartBadgeProps> = ({
  itemCount = 0,
  className,
  variant = "ghost",
  size = "sm",
  showText = true,
}) => {
  return (
    <Link to="/cart">
      <Button
        variant={variant}
        size={size}
        className={cn(
          "relative text-muted-foreground hover:text-foreground transition-colors",
          className,
        )}
        aria-label={`View cart with ${itemCount} items`}
      >
        <div className="relative">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full border-2 border-background"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          )}
        </div>
        {showText && <span className="ml-2">Cart</span>}
      </Button>
    </Link>
  );
};

export default CartBadge;
