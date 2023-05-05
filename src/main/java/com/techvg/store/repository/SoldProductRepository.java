package com.techvg.store.repository;

import com.techvg.store.domain.SoldProduct;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SoldProduct entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SoldProductRepository extends JpaRepository<SoldProduct, Long> {}
