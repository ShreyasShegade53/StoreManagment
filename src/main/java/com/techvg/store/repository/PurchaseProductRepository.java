package com.techvg.store.repository;

import com.techvg.store.domain.PurchaseProduct;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PurchaseProduct entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PurchaseProductRepository extends JpaRepository<PurchaseProduct, Long> {}
