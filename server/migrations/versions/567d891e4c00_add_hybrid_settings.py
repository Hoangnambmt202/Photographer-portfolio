"""add hybrid settings

Revision ID: 567d891e4c00
Revises: fe42da593744
Create Date: 2025-12-25 16:02:05.242815

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "567d891e4c00"
down_revision: Union[str, Sequence[str], None] = "fe42da593744"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "settings",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("site_name", sa.String(150), nullable=False),
        sa.Column("site_description", sa.Text),
        sa.Column("logo_url", sa.String(255)),
        sa.Column("theme", sa.String(20)),
        sa.Column("language", sa.String(10)),
        sa.Column("currency", sa.String(10)),
        sa.Column("timezone", sa.String(50)),
        sa.Column("contact_email", sa.String(150)),
        sa.Column("contact_phone", sa.String(50)),
        sa.Column("address", sa.String(255)),
        sa.Column("is_maintenance", sa.Boolean, default=False),
        sa.Column(
            "settings",
            postgresql.JSONB(astext_type=sa.Text()),
            server_default=sa.text("'{}'::jsonb"),
        ),
        sa.Column("updated_by", sa.Integer),
        sa.Column("created_at", sa.DateTime),
        sa.Column("updated_at", sa.DateTime),
    )


def downgrade() -> None:
    op.drop_table("settings")
