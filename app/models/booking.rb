require 'date'

# == Schema Information
#
# Table name: bookings
#
#  id          :bigint(8)        not null, primary key
#  user_id     :integer          not null
#  listing_id  :integer          not null
#  guest_count :integer          not null
#  status      :string           default("PENDING"), not null
#  start_date  :datetime         not null
#  end_date    :datetime         not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Booking < ApplicationRecord
  validates :user_id, :listing_id, :guest_count, :status, :start_date, :end_date, presence: true
  
  belongs_to :user
  belongs_to :listing

  def approve!
    # TO DO: pad the new listing availabilites by adding a day to them on either side of the booking dates
    listing_availability = self.listing.listing_availabilities
      .where('start_date <= :start_date AND end_date >= :end_date',
              start_date: self.start_date, end_date: self.end_date).first
    
    if (self.start_date == listing_availability.start_date && 
        self.end_date == listing_availability.end_date)
      return ListingAvailability.find(listing_availability.id).destroy

    elsif self.start_date == listing_availability.start_date
      listing_availability.start_date = self.end_date
      
    elsif self.end_date == listing_availability.end_date
      listing_availability.end_date = self.start_date

    else
      ListingAvailability.create(
        listing_id: self.listing_id,
        start_date: self.end_date,
        end_date: listing_availability.end_date)
      listing_availability.end_date = self.start_date
    end
    
    listing_availability.save!
  end

  def approved?
    self.status == 'APPROVED'
  end

  def denied?
    self.status == 'DENIED'
  end

  def deny!
    self.status = 'DENIED'
    self.save!
  end

  def pending?
    self.status == 'PENDING'
  end

  private

  def assign_pending_status
    self.status ||= 'PENDING'
  end

  def overlapping_requests
    Booking
      .where.not(id: self.id)
      .where(listing_id: listing_id)
      .where.not('start_date > :end_date OR end_date < :start_date',
                 start_date: start_date, end_date: end_date)
  end

  def overlapping_approved_requests
    overlapping_requests.where('status = \'APPROVED\'')
  end

  def overlapping_pending_requests
    overlapping_requests.where('status = \'PENDING\'')
  end

  def does_not_overlap_approved_request
    return if self.denied?

    unless overlapping_approved_requests.empty?
      errors[:base] <<
        'Request conflicts with existing approved request'
    end
  end

  def start_must_come_before_end
    return if start_date < end_date
    errors[:start_date] << 'must come before end date'
    errors[:end_date] << 'must come after start date'
  end

end
