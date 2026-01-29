"""base

Revision ID: fd30492aae39
Revises:
Create Date: 2025-12-21 21:33:37.326126

"""

from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = "fd30492aae39"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
