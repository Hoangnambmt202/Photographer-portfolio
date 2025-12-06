"""Add order to photos and featured_photo_id to albums

Revision ID: add_order_featured_001
Revises: 7764f2863914
Create Date: 2025-12-03 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_order_featured_001'
down_revision = '7764f2863914'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add 'order' column to photos table
    op.add_column('photos', sa.Column('order', sa.Integer, nullable=True, server_default='0'))
    
    # Add 'featured_photo_id' column to albums table
    op.add_column('albums', sa.Column('featured_photo_id', sa.Integer, nullable=True))
    
    # Add foreign key constraint
    op.create_foreign_key(
        'fk_albums_featured_photo_id',
        'albums', 'photos',
        ['featured_photo_id'], ['id'],
        ondelete='SET NULL'
    )


def downgrade() -> None:
    # Drop foreign key
    op.drop_constraint('fk_albums_featured_photo_id', 'albums', type_='foreignkey')
    
    # Remove columns
    op.drop_column('albums', 'featured_photo_id')
    op.drop_column('photos', 'order')
