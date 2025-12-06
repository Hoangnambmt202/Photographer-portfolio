"""merge heads

Revision ID: 057d5627247a
Revises: 0c03fb26f0e8, add_order_featured_001
Create Date: 2025-12-03 22:10:09.866890

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '057d5627247a'
down_revision: Union[str, Sequence[str], None] = ('0c03fb26f0e8', 'add_order_featured_001')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
